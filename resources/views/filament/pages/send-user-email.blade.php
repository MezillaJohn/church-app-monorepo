<x-filament-panels::page>
    <form wire:submit="send">
        {{ $this->form }}

        <x-filament::button type="submit" wire:loading.attr="disabled">
            Send Email
        </x-filament::button>
    </form>
</x-filament-panels::page>

