<x-filament-panels::page>
    <form wire:submit="save">
        {{ $this->form }}

        <x-filament::button type="submit" wire:loading.attr="disabled">
            Save Settings
        </x-filament::button>
    </form>
</x-filament-panels::page>

